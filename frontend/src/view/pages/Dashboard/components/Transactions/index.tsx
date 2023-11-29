import { Swiper, SwiperSlide } from 'swiper/react';

import { SliderOption } from './SliderOption';
import { SliderNavigation } from './SliderNavigation';
import { useTransactionsController } from './useTransactionsController';
import EmptyStateImg from '../../../../../assets/empty-state.svg';
import { TransactionTypeDropdown } from './TransactionTypeDropdown';
import { Spinner } from '../../../../components/Spinner';
import { FilterIcon } from '../../../../components/icons/FilterIcon';
import { MONTHS } from '../../../../../app/config/constants';
import { CategoryIcon } from '../../../../components/icons/categories/CategoryIcon';
import { cn } from '../../../../../app/utils/cn';
import { formatCurrency } from '../../../../../app/utils/formatCurrency';
import { FiltersModal } from './FiltersModal';
import { formatDate } from '../../../../../app/utils/formatDate';

export function Transactions() {
  const {
    areValuesVisible,
    isInitialLoading,
    isLoading,
    transactions,
    handleCloseFiltersModal,
    handleOpenFiltersModal,
    isFiltersModalOpen,
    filters,
    handleChangeFilters,
    handleApplyFilters,
  } = useTransactionsController();

  const hasTransactions = transactions.length > 0;

  return (
    <div className="bg-gray-100 rounded-2xl w-full h-full p-10 flex flex-col">
      {isInitialLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner className="w-10 h-10" />
        </div>
      )}

      {!isInitialLoading && (
        <>
          <FiltersModal
            onApplyFilters={handleApplyFilters}
            open={isFiltersModalOpen}
            onClose={handleCloseFiltersModal}
          />

          <header>
            <div className="flex items-center justify-between">
              <TransactionTypeDropdown
                onSelect={handleChangeFilters('type')}
                selectedType={filters.type}
              />

              <button onClick={handleOpenFiltersModal}>
                <FilterIcon />
              </button>
            </div>

            <div className="mt-6 relative">
              <Swiper
                slidesPerView={3}
                centeredSlides
                initialSlide={filters.month}
                onSlideChange={(swiper) => {
                  handleChangeFilters('month')(swiper.realIndex);
                }}
              >
                <SliderNavigation />
                {MONTHS.map((month, index) => (
                  <SwiperSlide key={month}>
                    {({ isActive }) => (
                      <SliderOption
                        isActive={isActive}
                        month={month}
                        index={index}
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </header>

          <div className="mt-4 space-y-2 flex-1 overflow-y-auto">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <Spinner className="w-10 h-10" />
              </div>
            )}

            {!hasTransactions && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <img src={EmptyStateImg} alt="Empty State" />
                <p className="text-gray-700">
                  Não encontramos nenhuma transação!
                </p>
              </div>
            )}

            {hasTransactions &&
              !isLoading &&
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white p-4 rounded-2xl flex items-center justify-between gap-4"
                >
                  <div className="flex-1 flex items-center gap-3">
                    <CategoryIcon
                      category={transaction.category?.icon}
                      type={
                        transaction.type === 'EXPENSE' ? 'expense' : 'income'
                      }
                    />
                    <div>
                      <strong className="font-bold tracking-[-0.5px] block">
                        {transaction.name}
                      </strong>
                      <span className="text-sm text-gray-600">
                        {formatDate(new Date(transaction.date))}
                      </span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'tracking-[-0.5px] font-medium',
                      transaction.type === 'EXPENSE'
                        ? 'text-red-800'
                        : 'text-green-900',
                      !areValuesVisible && 'blur-sm'
                    )}
                  >
                    {transaction.type === 'EXPENSE' ? '-' : '+'}
                    {formatCurrency(transaction.value)}
                  </span>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
